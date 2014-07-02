<?php
include 'models/Row.php';

$sidecarXML = new SimpleXMLElement('<sidecar/>');
foreach($_GET['items'] as $entry) {
  $row = new Row($entry);
  $rowElem = $sidecarXML->addChild('entry');
  $rowElem->addChild('entry', (string)$row->toXML($rowElem));
}
$dom = new DOMDocument('1.0');
$dom->preserveWhiteSpace = false;
$dom->formatOutput = true;
$dom->loadXML($sidecarXML->asXML());
echo $dom->saveXML();