<?php

namespace App\Services;

use SimpleXMLElement;
use Exception;

class XmlService
{
    public static function xmlToArray($xmlElement): array
    {
        $array = [];

        foreach ($xmlElement as $key => $value) {
            $itemArray = [];

            foreach ($value->attributes() as $attrName => $attrValue) {
                $itemArray[$attrName] = (string) $attrValue;
            }

            $valueArray = self::xmlToArray($value);

            if (!empty($valueArray)) {
                $itemArray = array_merge($itemArray, $valueArray);
            }

            if (!isset($array[$key])) {
                $array[$key] = $itemArray;
            } else {
                if (!is_array($array[$key]) || !isset($array[$key][0])) {
                    $array[$key] = [$array[$key]];
                }
                $array[$key][] = $itemArray;
            }
        }

        if (trim((string) $xmlElement)) {
            $array['#text'] = (string) $xmlElement;
        }

        return $array;
    }

    public static function parsingXML(string $xmlMessage): ?string
    {
        try {

            libxml_use_internal_errors(true);
            $xml = simplexml_load_string($xmlMessage);
            if ($xml === false) {
                foreach (libxml_get_errors() as $error) {
                    logger()->error("XML Error: " . $error->message);
                }
                return null;
            }

            $xml = new SimpleXMLElement($xmlMessage);
            $jsonArray = self::xmlToArray($xml);

            $json = json_encode($jsonArray, JSON_PRETTY_PRINT);

            return $json;
        } catch (Exception $e) {
            logger()->error("Error al procesar XML: " . $e->getMessage());
            return null;
        }
    }

    public static function extractXmlAlarmMessage(string &$buffer): array
    {
        //ORIGINALMENTE EL IF TENIA ESTO:strpos($buffer, '/SendAlarmData') !== false
        if (str_contains($buffer, '/SendAlarmData') ) {
            $xmlPos = strpos($buffer, '<?xml');
            if ($xmlPos !== false) {
                $xmlContent = substr($buffer, $xmlPos);
                $endPos = strpos($xmlContent, '</config>');

                if ($endPos !== false) {
                    $xmlMessage = substr($xmlContent, 0, $endPos + strlen('</config>'));
                    $buffer = substr($buffer, $endPos + strlen('</config>')); // Limpiar el buffer
                    return [$xmlMessage, $buffer];
                } else {
                    logger()->warning("XML mal formado: no se encontró </config>");
                }
            } else {
                logger()->warning("Encabezado XML no encontrado.");
            }
        }

        return [null, $buffer];
    }

    public static function jsonToArray(string $json): array
    {
        return json_decode($json, true);
    }
}
