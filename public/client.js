// client-side js
// run by the browser each time your view template referencing it is loaded

console.log('Testing insert');

function submit()
{
  console.log("Submitting!")
  // request the user from our app's sqlite database
/*   const userRequest = new XMLHttpRequest();
  userRequest.open('post', '/addRow');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'id':document.getElementById("id").value, 'name': document.getElementById("name").value})); */

  $.ajax({
    type: "GET",
    url: 'http://127.0.0.1:5000/users',
    dataType: "json",
    success: function(res) {
        console.log("Success!")
        var res_data = JSON.parse(res);
        console.log(res_data);
    },
    error: function(res) {
      console.log("Fail!", res)
    }
  });
}