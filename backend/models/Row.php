<?php

class Row {
  
  protected $_data = array();
  
  public function __construct($data) {
    $this->_data = array(
        'contentSource' => array(
            'articleName' => $this->_prepareValue('articleName', $data['article_name']),
            'sourceFormat' => $this->_prepareValue('sourceFormat', $data['source_format']),
            'customTocIcon' => $this->_prepareValue('customTocIcon', $data['custom_toc_icon']),
            'sourceFile_v' => array(
                'location' => $this->_prepareValue('sourceFile_v_location', $data['vertical_file_location']),
                'layoutName' => $this->_prepareValue('sourceFile_v_layoutName', $data['vertical_file_layout_name']),
            ),
            'sourceFile_h' => array(
                'location' => $this->_prepareValue('sourceFile_h_location', $data['horizontal_file_location']),
                'layoutName' => $this->_prepareValue('sourceFile_h_layoutName', $data['horizontal_file_layout_name']),
            )
        ),
        'articleTitle' => $this->_prepareValue('articleTitle', $data['article_title']),
        'author' => $this->_prepareValue('author', $data['author']),
        'kicker' => $this->_prepareValue('kicker', $data['kicker']),
        'description' => $this->_prepareValue('description', $data['description']),
        'tags' => $this->_prepareValue('tags', $data['tags']),
        'isAd' => $this->_prepareValue('isAd', $data['ads']),
        'smoothScrolling' => $this->_prepareValue('smoothScrolling', $data['smooth_scrolling']),
        'isFlattenedStack' => $this->_prepareValue('isFlattenedStack', $data['flattened_stack']),
        'articleAccess' => $this->_prepareValue('articleAccess', $data['article_access']),
    );
    
  }
  
  public function toXML($xml) {
    foreach($this->_data as $nodeName => $nodeVal) {
      $this->_addXMLNode($xml, $nodeName, $nodeVal);
    }
    
    return $xml;
  }
  
  protected function _addXMLNode($xml, $nodeName, $nodeVal) {
    if (!is_array($nodeVal)) {
      $xml->addChild($nodeName, $nodeVal);
    }
    else {
      $subnode = $xml->addChild($nodeName);
      foreach($nodeVal as $subnodeName => $subnodeVal) {
        $this->_addXMLNode($subnode, $subnodeName, $subnodeVal);
      }
    }
    
    return $xml;
  }
  
  protected function _prepareValue($key, $value) {
    switch ($key) {
      case 'sourceFormat':
        return $value[0] == 'InDesign' ? 'indd' : 'html';
      break;
      case 'isAd':
      case 'isFlattenedStack':
        return $value == 'true' ? true : false;
      break;
      default:
        return $value;
      break;
    }
  }
}