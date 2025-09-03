export const GetProductsMock = {
  sys: {
    type: 'Array',
  },
  total: 1,
  skip: 0,
  limit: 1,
  items: [
    {
      metadata: {
        tags: [],
        concepts: [],
      },
      sys: {
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: '9xs1613l9f7v',
          },
        },
        id: '4HZHurmc8Ld78PNnI1ReYh',
        type: 'Entry',
        createdAt: '2024-01-23T21:47:08.012Z',
        updatedAt: '2024-01-23T21:47:08.012Z',
        environment: {
          sys: {
            id: 'master',
            type: 'Link',
            linkType: 'Environment',
          },
        },
        publishedVersion: 1,
        revision: 1,
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'product',
          },
        },
        locale: 'en-US',
      },
      fields: {
        sku: 'ZIMPDOPD',
        name: 'Apple Mi Watch',
        brand: 'Apple',
        model: 'Mi Watch',
        category: 'Smartwatch',
        color: 'Rose Gold',
        price: 1410.29,
        currency: 'USD',
        stock: 7,
      },
    },
  ],
};
