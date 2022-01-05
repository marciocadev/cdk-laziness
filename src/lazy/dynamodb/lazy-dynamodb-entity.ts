#!/usr/bin/env node

export interface LazyDynamoDBEntity {
  key: string;
  type: string;
  description?: string;
}
