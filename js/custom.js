$(document).ready(function () {
    // Function to initialize Autocomplete
    function initAutocomplete() {
        // Replace the URL with your server-side endpoint that handles autocomplete requests
        const apiUrl = 'autocomplete.php';

        // Initialize Autocomplete only when at least three characters are typed
        $('#search-category').autocomplete({
            source: function (request, response) {
                // Check if the input has at least three characters
                if (request.term.length >= 3) {
                    // Make an Ajax request to fetch the autocomplete suggestions
                    $.ajax({
                        url: apiUrl,
                        method: 'GET',
                        data: { query: request.term },
                        dataType: 'json',
                        success: function (data) {
                            // Process the fetched data and pass it to the response callback
console.log("res==",data);
                                response(data);
                        },
                        error: function (error) {
                            console.error('Error fetching autocomplete suggestions:', error);
                        }
                    });
                } else {
                    // If the input has less than three characters, close the autocomplete menu
                    response([]);
                }
            },
            minLength: 3, // Minimum characters before triggering autocomplete
            select: function (event, ui) {
                var d = ui.item.value;  
            console.log("vasl==",d)
            $("#search-category").val(d);
            }
        });
    }

    // Call the initAutocomplete function to set up autocomplete on the search-category input field
    initAutocomplete();
});

    var searchData; // Variable to store recent search data
    // Function to download data as CSV
    function downloadCSV() {
    if (searchData && searchData.length > 0) {
        var csvContent = "data:text/csv;charset=utf-8,";

        // Header row
        csvContent += "Title,Link,Snippet\n";

        // Data rows
        searchData.forEach(function (row) {
            csvContent += row.title + "," + row.link + "," + row.snippet + "\n";
        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "search_results.csv");
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);
    } else {
        console.log("No data to export. Search result is blank.");
        // You can show a message to the user or handle it in a way you prefer
    }
}

    // Function to show and hide the button loader
    function toggleButtonLoader() {
        $('#button-text').toggle();
        $('#button-loader').toggleClass('d-none');
    }
    function showLoadingBar() {
        $('#loading-bar').show();
        var progress = 0;
        var interval = setInterval(function() {
            $('#loading-bar-progress').css('width', progress + '%');
            if (progress >= 1000) {
                clearInterval(interval);
                $('#loading-bar').hide();
            }
            progress += 2;
        }, 1000);
    }
    function validateInputs() {
        var query = $("#search-box").val();
        var loc = $("#search-category").val();
        var isValid = true;

        // Clear previous error messages
        //$("#search-box-error").text("");
        

        // Add your validation logic here
        if (!query) {
            //$("#search-box-error").text("Please enter a search term.");
            isValid = false;
        }

        return isValid;
    }

    // Toggle the visibility of the search results
    $('#submit-button').on('click', function() {

        if (validateInputs()) {
            // ... Your existing code ...
            //alert("cdcdd");
            const searchUrl = "search_data.php";
            var query = $("#search-box").val();
            var loc = $("#search-category").val();
            $("#search-results").html('<div id="loading-bar"><div id="loading-bar-progress"></div></div>');
            // Show loading bar before making the Ajax request
            toggleButtonLoader();
            showLoadingBar();
            $.ajax({
                            url: searchUrl,
                            method: 'GET',
                            data: { query: query, loc:loc },
                            dataType: 'json',
                            success: function (data) {
                                if (searchData && searchData.length > 0){
                                    console.log("res==",data);
                                    searchData = data; // Store the recent search data
                                    var html = '';
                                    $.each(data, function(key, value) {
                                        html += '<div class="result-card"><div class="label">Title:</div><div class="value">'+value.title+'</div><div class="label">Link:</div><div class="value">'+value.link+'</div><div class="label">Snippet:</div><div class="value">'+value.snippet+'</div></div>';
                                    console.log(key + ": " + value);
                                    
                                    });
                                    $("#search-results").html(html);
                                    // Hide button loader after data is loaded
                                    toggleButtonLoader();
                                        // response(data);
                                }else{
                                    toggleButtonLoader();
                                    $("#search-results").html("No records were found using this criteria");
                                }
                                // Process the fetched data and pass it to the response callback
                            
                            },
                            error: function (error) {
                                console.error('Error fetching autocomplete suggestions:', error);
                                // Hide button loader after data is loaded
                                toggleButtonLoader();
                            }
                        });
        }
    });
    $('#export-csv').on('click', function (e) {
        e.preventDefault();
        // Replace this with your actual data source
        
        downloadCSV();
    });
