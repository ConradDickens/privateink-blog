// Auto-generated file - DO NOT EDIT
// Generated from deployment artifacts

export const PrivateInkBlogABI = [
  {
    "inputs": [],
    "name": "AlreadyDisliked",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AlreadyHasAccess",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AlreadyLiked",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "BlogNotFound",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InsufficientPayment",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoEarningsToWithdraw",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotAuthor",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "blogId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "BlogDisliked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "blogId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "BlogLiked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "blogId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "author",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "contentCID",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isPaid",
        "type": "bool"
      }
    ],
    "name": "BlogPublished",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "blogId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "reader",
        "type": "address"
      }
    ],
    "name": "BlogUnlocked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "blogId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "author",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "EarningsWithdrawn",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "accessTokens",
    "outputs": [
      {
        "internalType": "ebool",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "authorBlogs",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "blogCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "blogs",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "author",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "contentCID",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "summary",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isPaid",
        "type": "bool"
      },
      {
        "internalType": "uint64",
        "name": "priceInWei",
        "type": "uint64"
      },
      {
        "internalType": "euint64",
        "name": "price",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "likeCount",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "dislikeCount",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "unlockCount",
        "type": "bytes32"
      },
      {
        "internalType": "euint64",
        "name": "totalEarnings",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blogId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "checkAccess",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isFree",
        "type": "bool"
      },
      {
        "internalType": "ebool",
        "name": "accessToken",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blogId",
        "type": "uint256"
      }
    ],
    "name": "dislikeBlog",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "author",
        "type": "address"
      }
    ],
    "name": "getAuthorBlogs",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blogId",
        "type": "uint256"
      }
    ],
    "name": "getBlog",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "author",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "contentCID",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "summary",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isPaid",
            "type": "bool"
          },
          {
            "internalType": "uint64",
            "name": "priceInWei",
            "type": "uint64"
          },
          {
            "internalType": "euint64",
            "name": "price",
            "type": "bytes32"
          },
          {
            "internalType": "euint32",
            "name": "likeCount",
            "type": "bytes32"
          },
          {
            "internalType": "euint32",
            "name": "dislikeCount",
            "type": "bytes32"
          },
          {
            "internalType": "euint32",
            "name": "unlockCount",
            "type": "bytes32"
          },
          {
            "internalType": "euint64",
            "name": "totalEarnings",
            "type": "bytes32"
          }
        ],
        "internalType": "struct PrivateInkBlog.Blog",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalBlogs",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasDisliked",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasLiked",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blogId",
        "type": "uint256"
      }
    ],
    "name": "likeBlog",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "contentCID",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "summary",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isPaid",
        "type": "bool"
      },
      {
        "internalType": "uint64",
        "name": "priceInWei",
        "type": "uint64"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedPrice",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "publishBlog",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "blogId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blogId",
        "type": "uint256"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedPayment",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "unlockBlog",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blogId",
        "type": "uint256"
      }
    ],
    "name": "withdrawEarnings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export type PrivateInkBlogABI = typeof PrivateInkBlogABI;
