// Agg. Pipeline based on user data in aggregat_tuts collection 
// 1. Query :- which country has the highest number of registered users
[
    {
        $group: {
            _id: "$company.location.country",
            count: { $sum: 1 },
        },
    },
    {
        $sort: {
            count: -1,
        },
    },
    {
        $limit: 2,
    },
]

// 2. Query :- Find the total number of males and females 

[
    {
        $group: {
            _id: "$gender",
            count: { $sum: 1 }
        }
    }
]

// 3. Query :- List all unique eye colors present in collection

[
    {
        $group: {
            _id: "$eyeColor"
        }
    }
]

// 4. Query :- What is the average number of tags per user

[
    {
        $unwind: "$tags",
    },
    {
        $group: {
            _id: "$_id",
            numberOfTags: { $sum: 1 },
        },
    },
    {
        $group: {
            _id: null,
            avgTags: { $avg: "$numberOfTags" },
        },
    }
]

// OR

[
    {
        $addFields: {
            numberOfFields: {
                $size: { $ifNull: ["$tags", []] }
            }
        }
    },
    {
        $group: { _id: null, average: { $avg: '$numberOfFields' } }
    }
]

// 5. Query :- How many users have enim tag 

[
    {
        $match: {
            tags: "id"
        }
    },
    {
        $count: "count"
    }
]

// 6. Query :- What are the names and age of users who are inactive and have 'velit' as a tag

[
    {
      $match: {
        tags : "velit",
        isActive : false
      }
    },
    {
      $project: {
        age : 1,
        name : 1
      }
    }
  ]

// 7. Query :- How many users have a phone number starting with '+1 (940)'

[
    {
      $match: {
        "company.phone" : /^\+1 \(940\)/
      }
    },
    {
      $count : "count"
    }
  ]

  // 8. Query :- Who has registered most recently

  [
    {
      $sort : {
        registered : -1
      }
    },
    {
      $limit : 4
    },
    {
      $project: {
        gender : 1,
        registered : 1,
        name : 1,
        favoriteFruit : 1
      }
    }
  ]

  //9. Query:- Categorize users by their favorite fruit
  
  [
    {
      $group: {
        _id: "$favoriteFruit",
        count : {$sum : 1},
        users : { $push : "$name" }
      },
    }
  ]

  //10. Query :- How many users have 'ad' as their second tag in the list of tags

  [
    {
      $match : {
        "tags.1" : "ad"
      }
    },
    {
      $count: 'count'
    }
  ]

  // 11. Query :- Find users who have both 'enim' and 'ad' as their tags

  [
    {
      $match : {
        tags : {
          $all : ["enim", "id"]
        }
      }
    }
  ]

  // 12. Query :- List all the companies located in the USA with their corresponding user count

  // WITH DUPLICATE VALUES 

  [  {
    $group: {
      _id: "$company.location.country",
      companies : {$push: "$company.title"}
    },
  },
  {
    $match: {
      _id : "USA"
    }
  }]

  // WITHOUT DUPLICATE VALUES

  [
    {
      $match: {
        "company.location.country" : "USA"
      }
    },
    {
      $group: {
        _id: "$company.title",
      }
    }
  ]

