export const LOGIN_MUTATION = /* GraphQL */ `
  mutation IdentityLogin($input: LoginInput!) {
    identity__login(input: $input) {
      accessToken
      mustChangePassword
      memberships {
        tenant
        roles
      }
    }
  }
`;

export const ME_QUERY = /* GraphQL */ `
  query IdentityMe {
    identity__me {
      _id
      name
      email
      memberships {
        tenant
        roles
      }
    }
  }
`;

export const DASHBOARD_OVERVIEW_QUERY = /* GraphQL */ `
  query DashboardOverview {
    report__dashboardOverview {
      orders {
        total
        growth {
          percentage
          period
        }
      }
      revenue {
        total
        currency
        growth {
          percentage
          period
        }
      }
      customers {
        total
        growth {
          percentage
          period
        }
      }
      products {
        total
        newThisWeek
      }
    }
  }
`;

export const ORDERS_QUERY = /* GraphQL */ `
  query SaleInvoices($where: CommonPaginationDto) {
    sale__invoices(where: $where) {
      nodes {
        _id
        invoiceUID
        paymentStatus
        invoiceStatus
        paymentMethod
        netTotalAmount
        createdAt
        customer {
          name
          email
          phoneNumber
        }
      }
      meta {
        totalCount
        currentPage
        hasNextPage
        totalPages
      }
    }
  }
`;

export const ORDER_DETAIL_QUERY = /* GraphQL */ `
  query SaleInvoice($where: CommonFindDocumentDto!) {
    sale__invoice(where: $where) {
      _id
      invoiceUID
      paymentStatus
      invoiceStatus
      paymentMethod
      note
      subTotalAmount
      netTotalAmount
      taxAmount
      deliveryCharge
      deliveryArea
      createdAt
      customer {
        name
        email
        phoneNumber
      }
      shippingAddress {
        caption
      }
      lineItems {
        quantity
        unitPrice
        sku
        item {
          name
        }
      }
    }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  query InventoryProducts($where: CommonPaginationDto) {
    inventory__products(where: $where) {
      nodes {
        _id
        title
        handle
        price
        status
        collections {
          name
        }
      }
      meta {
        totalCount
        currentPage
        hasNextPage
        totalPages
      }
    }
  }
`;
