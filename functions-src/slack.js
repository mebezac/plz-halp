exports.handler = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    "headers": { 'Content-Type': 'application/json' },
    body: JSON.stringify({
    "response_type": "in_channel",
    "text": "It's 80 degrees right now.",
    "attachments": [
        {
            "text":"Partly cloudy today and tomorrow"
        }
    ]
})
  })
}
