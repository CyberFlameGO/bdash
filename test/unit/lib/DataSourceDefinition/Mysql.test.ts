import assert from "assert";
import initialize from "../../../fixtures/mysql/initialize";
import Mysql from "../../../../src/lib/DataSourceDefinition/Mysql";
import DataSourceConfig from "../../../helpers/DataSourceConfig";

suite("DataSourceDefinition/Mysql @remote", function () {
  this.timeout(10000);
  const config = DataSourceConfig.mysql;

  suiteSetup(async () => {
    await initialize();
  });

  test("select", async () => {
    const result = await new Mysql(config).execute("select id, text from test order by id");
    assert.deepStrictEqual(result, {
      fields: ["id", "text"],
      rows: [
        [1, "foo"],
        [2, "bar"],
        [3, "baz"],
      ],
    });
  });

  test("insert", async () => {
    const result = await new Mysql(config).execute("insert into test values (4, 'hoge')");
    assert.deepStrictEqual(result, {
      fields: [],
      rows: [],
    });
  });

  test("update", async () => {
    const result = await new Mysql(config).execute("update test set text = 'hoge'");
    assert.deepStrictEqual(result, {
      fields: [],
      rows: [],
    });
  });

  test("delete", async () => {
    const result = await new Mysql(config).execute("delete from test where id = 1");
    assert.deepStrictEqual(result, {
      fields: [],
      rows: [],
    });
  });

  test("cancel", async () => {
    const connection = new Mysql(config);
    const timer = setTimeout(() => assert.fail("can not cancel"), 2000);
    setTimeout(() => connection.cancel(), 500);

    try {
      await connection.execute("select sleep(5)");
      clearTimeout(timer);
    } catch (err) {
      assert.fail(err);
    }
  });

  test("connectionTest successful", async () => {
    await new Mysql(config).connectionTest();
  });

  test("connectionTest failed", async () => {
    try {
      await new Mysql({ host: "x" }).connectionTest();
      assert.fail("connectionTest does not fail");
    } catch (err) {
      assert.ok(/getaddrinfo (ENOTFOUND|EAI_AGAIN)/.test(err.message));
    }
  });
});
