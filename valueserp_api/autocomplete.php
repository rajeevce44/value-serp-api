<?php
require('constants.php');
// Sample array of categories
$query = $_GET['query'];

# set up the request parameters
$queryString = http_build_query([
    'api_key' => 'demo',
    'q' => $query
  ]);
  $api_url = API_URL.'locations';
  # make the http GET request to VALUE SERP
  $ch = curl_init(sprintf('%s?%s', $api_url, $queryString));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
  # the following options are required if you're using an outdated OpenSSL version
  # more details: https://www.openssl.org/blog/blog/2021/09/13/LetsEncryptRootCertExpire/
  curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($ch, CURLOPT_TIMEOUT, 180);
  
  $api_result = curl_exec($ch);
  curl_close($ch);
  
  # print the JSON response from VALUE SERP
  $res = json_decode($api_result,true);
  $loc_name=[];
  if(!empty($res)){
    foreach($res['locations'] as $loc){
       $loc_name[]=$loc['full_name'];

    }
}
// Return suggestions as JSON
//header('Content-Type: application/json');
  echo json_encode($loc_name);

?>
