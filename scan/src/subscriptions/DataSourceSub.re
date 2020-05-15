type t = {
  id: ID.DataSource.t,
  owner: Address.t,
  name: string,
  description: string,
  executable: JsBuffer.t,
  timestamp: MomentRe.Moment.t,
};

module MultiConfig = [%graphql
  {|
  subscription DataSources($limit: Int!, $offset: Int!) {
    data_sources(limit: $limit, offset: $offset, order_by: {last_updated: desc}) @bsRecord {
      id @bsDecoder(fn: "ID.DataSource.fromJson")
      owner @bsDecoder(fn: "Address.fromBech32")
      name
      description
      executable @bsDecoder(fn: "GraphQLParser.buffer")
      timestamp: last_updated @bsDecoder(fn: "GraphQLParser.time")
    }
  }
|}
];

module SingleConfig = [%graphql
  {|
  subscription DataSource($id: bigint!) {
    data_sources_by_pk(id: $id) @bsRecord {
      id @bsDecoder(fn: "ID.DataSource.fromJson")
      owner @bsDecoder(fn: "Address.fromBech32")
      name
      description
      executable @bsDecoder(fn: "GraphQLParser.buffer")
      timestamp: last_updated @bsDecoder(fn: "GraphQLParser.time")
    }
  },
|}
];

module DataSourcesCountConfig = [%graphql
  {|
  subscription DataSourcesCount {
    data_sources_aggregate{
      aggregate{
        count @bsDecoder(fn: "Belt_Option.getExn")
      }
    }
  }
|}
];

let get = id => {
  let (result, _) =
    ApolloHooks.useSubscription(
      SingleConfig.definition,
      ~variables=SingleConfig.makeVariables(~id=id |> ID.DataSource.toJson, ()),
    );
  let%Sub x = result;
  switch (x##data_sources_by_pk) {
  | Some(data) => Sub.resolve(data)
  | None => NoData
  };
};

let getList = (~page, ~pageSize, ()) => {
  let offset = (page - 1) * pageSize;
  let (result, _) =
    ApolloHooks.useSubscription(
      MultiConfig.definition,
      ~variables=MultiConfig.makeVariables(~limit=pageSize, ~offset, ()),
    );
  result |> Sub.map(_, x => x##data_sources);
};

let count = () => {
  let (result, _) = ApolloHooks.useSubscription(DataSourcesCountConfig.definition);
  result
  |> Sub.map(_, x => x##data_sources_aggregate##aggregate |> Belt_Option.getExn |> (y => y##count));
};
