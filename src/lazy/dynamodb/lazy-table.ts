#!/usr/bin/env node

import { Project, SourceCode } from "projen";
import { LazyDynamoDBEntity } from "./lazy-dynamodb-entity";

export class LazyDynamoDBTable extends Project {
  readonly entityName: string;
  readonly pathFile?: string;

  constructor(entityName: string, pathFile?: string) {
    super({ name: entityName, outdir: pathFile });
    if (entityName.length >= 1) {
      this.entityName =
        entityName.charAt(0).toUpperCase() + entityName.slice(1);
    } else {
      this.entityName = entityName.toUpperCase();
    }
  }

  createTable(partitionKey: LazyDynamoDBEntity, sortKey?: LazyDynamoDBEntity) {
    const env = `${this.entityName.toUpperCase()}_TABLE_NAME`;
    const basename = this.entityName.toLowerCase();
    let file = `constructs/${basename}/table.ts`;
    const table = new SourceCode(this, file);
    table.line(
      'import { Table, TableProps, AttributeType } from "aws-cdk-lib/aws-dynamodb";'
    );
    table.line('import { Function } from "aws-cdk-lib/aws-lambda";');
    table.line('import { Construct } from "constructs";');
    table.line("");
    table.open("export enum GrantType {");
    table.line("Read = 1,");
    table.line("Write = 2,");
    table.line("ReadWrite = 3,");
    table.close("}");
    table.line("");
    table.line("/**");
    table.line(
      `* A Cloudformation \"AWS::DynamoDB::Table\" for **${this.name}** data`
    );
    table.line("*");
    table.line("* @cloudformationResource AWS::DynamoDB::Table");
    table.line("*/");
    table.open(`export class ${this.name}Table extends Table {`);
    table.line("/**");
    table.line(`* Create a new ${this.name}Table`);
    table.line("*");
    table.line("* @param scope - scope in which this resource is defined");
    table.line("* @param id    - scoped id of the resource");
    table.line("*/");
    table.open(
      "constructor(scope: Construct, id: string, props?: TableProps) {"
    );
    table.open("super(scope, id, props ? props : {");
    table.open("partitionKey: {");
    table.line(`name: "${partitionKey.key}",`);
    if (partitionKey.type === "number") {
      table.line("type: AttributeType.NUMBER,");
    } else if (partitionKey.type === "string") {
      table.line("type: AttributeType.STRING,");
    } else if (partitionKey.type === "binary") {
      table.line("type: AttributeType.BINARY,");
    }
    table.close("},");
    if (sortKey) {
      table.open("sortKey: {");
      table.line(`name: "${sortKey.key}",`);
      if (sortKey.type === "number") {
        table.line("type: AttributeType.NUMBER,");
      } else if (sortKey.type === "string") {
        table.line("type: AttributeType.STRING,");
      } else if (sortKey.type === "binary") {
        table.line("type: AttributeType.BINARY,");
      }
      table.close("},");
    }
    table.close("});");
    table.close("}");
    table.line("");
    table.line("/**");
    table.line("* Binding a table grant type to a handler");
    table.line("*");
    table.line("* @stability stable");
    table.line("* @param handler");
    table.line("* @param grantType");
    table.line("*/");
    table.open("public bind(handler: Function, grantType: GrantType) {");
    table.line(`handler.addEnvironment("${env}", this.tableName);`);
    table.open("if (grantType === GrantType.Write) {");
    table.line("this.grantWriteData(handler);");
    table.close("}");
    table.open("if (grantType === GrantType.Read) {");
    table.line("this.grantReadData(handler);");
    table.close("}");
    table.open("if (grantType === GrantType.ReadWrite) {");
    table.line("this.grantReadWriteData(handler);");
    table.close("}");
    table.close("}");
    table.close("}");
    return table;
  }
}
