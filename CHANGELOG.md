# 0.2.2-beta3
### Breaking Changes
Web Service operations have no callback anymore. Callback has been replaced by a Promise.

Before: 

      (client as any).Add(input, (err, wsurl: string, headers: any, xml: string) => ... )

After:
      
      client.operation('Add', body).then((operation: Operation) => ... )
      // or
      (client as any).Add(body).then((operation: Operation) => ... )

# 0.2.1
AOT compilation fixes (issue #1)

# 0.1.4
Initial version
