function loadQuery() {
    var dns_base_url = "https://cloudflare-dns.com/dns-query";
    
    var hostname = document.getElementById("dns-query").value;
    var dns_type = document.getElementById("dns-query-type").value;
    
    browser.storage.local.get("dns_url").then(
        // https://stackoverflow.com/questions/29516390/how-can-i-access-the-value-of-a-promise
        function (result) {
            dns_base_url = result.dns_url || dns_base_url;
            return sendQuery(dns_base_url, hostname, dns_type);
    }).catch(function (error) {
        return sendQuery(dns_base_url, hostname, dns_type);
    });

function sendQuery(dns_server_url)
{
    console.log("using DNS server ", dns_server_url);

    var dns_query_url = dns_server_url + `?name=${hostname}&type=${dns_type}`;

    fetch(dns_query_url, {
      headers: {
        'Accept': 'application/dns-json'
      }
    }).then((response) => {
            // Check if the response is ok
            if (!response.ok) {
              errMsg = `Error: ${response.status} - ${response.statusText}`;
              console.log(errMsg);
              return 1;
            }
            // Check if the response is in JSON format
            if (response.headers.get("Content-Type")
                .includes("json")) {
                  response.json().then(
                      function processResponse(result) {
                          console.log(result);
                          var resultStr = "";
                          if (result.Answer) {
                              for (var answer of result.Answer) {
                                  resultStr = resultStr + `${answer.name.toString()}, ${answer.data.toString()}\n`;
                              }
                          }
                          
                          document.getElementById("result").innerText = resultStr;
                          return result;
                      }).catch(function (error) {
                          console.log("error processing result:", error);
                          return 1
                      })
            } else {
                throw new Error("Unexpected Content-Type");
            }
        })
        .catch((error) => {
           console.log(`Error with fetch(): ${error.message}`)
        });
    }    
}

document.addEventListener('DOMContentLoaded', function () {
  var clickyButton = document.querySelector('#send-query');
  clickyButton.addEventListener('click', loadQuery);
});
