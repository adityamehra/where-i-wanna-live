
function loadData() {

    let $body = $('body');
    let $wikiElem = $('#wikipedia-links');
    let $nytHeaderElem = $('#nytimes-header');
    let $nytElem = $('#nytimes-articles');
    let $greeting = $('#greeting');
    let $street = $('#street');
    let $city = $('#city');
    let nytAPIKey = 'YOUR_API_KEY';

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    $greeting.text(`I want to live at ${$street.val()} in ${$city.val()}`)

    // load streetview
    $("img").remove(".bgimg");
    $body.append(`<img class="bgimg" src="https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${$street.val()}${$city.val()}&fov=90&heading=235&pitch=10">`);
    // YOUR CODE GOES HERE!
    $street.text("");
    $city.text("");

    let nytAPI = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

    nytAPI += $.param({
               'api-key': nytAPIKey,
               'q': `${$city.val()}`
              });

    $.getJSON( nytAPI, {
      format: "json"
    }).done(function(data){
      // console.log(data);
      $.each(data.response.docs, function(i, doc){
       $nytElem.append(`<li class="article">
                          <a href="${doc.web_url}">${doc.headline.main}</a>
                          <p> ${doc.snippet}</p>
                       </li>`)
      });
    }).fail(function(err){
      $nytHeaderElem.text("");
      $nytHeaderElem.text(`New York Times Articles couldn't be loaded...`);
    });

    let wikiAPI = `http://en.wikipedia.org/w/api.php?action=opensearch&search=${$city.val()}&format=json&callback=wikiCallback`

    $.ajax({
        url: wikiAPI,
        dataType: "jsonp",
        success: function (data, textStatus, jqXHR) {

        for(let i = 0; i < data[1].length; i++){
         $wikiElem.append( `<li class="article">
                              <a href="${data[3][i]}">${data[1][i]}</a>
                            </li>`)
        }

        console.log(data);
        },
        error: function (errorMessage) {
        }
    });

    return false;
};

$('#form-container').submit(loadData);
