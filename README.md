# next-meal ![Travis CI build icon](https://travis-ci.org/Next-Meal/next-meal.svg?branch=master)

Next-meal is an informational tool to assist those in need by helping them find local meal programs.
Information is gathered from <https://data.seattle.gov>.

## Routes

Meal information can be retrieved in two ways:
  1. HTTP Request
  2. SMS Request

### HTTP Request

Next-meal has several routes that allow for information to be retrieved in a filtered format.
To get all current information, an http GET request can be made to:

```
/api/meals
```

Alternatively, specific meal information can be retrieved by specificying which meal the user is searching for:

```
/api/meals/breakfast
/api/meals/lunch
/api/meals/dinner
```

### SMS Request

Next-meal allows for information to be requested via SMS messaging. Next meal will receive SMS messaging and response with a filtered response.

To receive a response {...}

