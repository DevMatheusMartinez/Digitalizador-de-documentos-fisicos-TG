<?php

namespace App\Functions;

class InArray
{
    public static function InArray(array $array, array $values):string
    {
        foreach($values as $value){
            if(!in_array($value, $array)){
                return  "O campo $value não foi encontrado";
            }
        }
        return "OK";
    }
}