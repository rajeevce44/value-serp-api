<?php
require('constants.php');
$query = $_GET['query'];
$loc = $_GET['loc'];
$search_text = [
    'api_key' => 'demo',
    'q' => $query
];
if(!empty($loc)){
    $search_text['location'] = $loc;
}
# set up the request parameters
$queryString = http_build_query($search_text);
$api_url = API_URL.'search';
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
  //echo $api_result; exit;

 $res=json_decode($api_result,true);
$org_res = [];
//echo "<pre>"; print_r($res['organic_results']);exit;
 if(!empty($res['organic_results']) && $res['request_info']['success']){
    foreach($res['organic_results'] as $record){
        if(isset($record['title']) && isset($record['link']) && isset($record['snippet'])){
            $org_res['result'][]= ["title"=>$record['title'],"link"=>$record['link'],"snippet"=>$record['snippet']];
        }
    }
    $org_res['success']=$res['request_info']['success'];
 }else if($res['request_info']['success'] == false){
    $org_res['success']=$res['request_info']['success'];
    $org_res['result'] = $res['request_info']['message'];
 }
 // Return suggestions as JSON
//header('Content-Type: application/json');
 echo json_encode($org_res);

?>