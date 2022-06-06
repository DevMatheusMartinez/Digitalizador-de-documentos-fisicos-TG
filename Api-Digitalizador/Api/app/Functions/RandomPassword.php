<?php

namespace App\Functions;

class RandomPassword
{
    public function generatePassword(int $numberOfCharacter = 8): string
    {
        $smallLetters = str_shuffle('abcdefghijklmnopqrstuvwxyz');

        $capitalLetters = str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

        $numbers = (((date('Ymd') / 12) * 24) + mt_rand(800, 9999));
        $numbers .= 1234567890;

        $specialCharacters = str_shuffle('!@#$%*-');

        $characters = $capitalLetters.$smallLetters.$numbers.$specialCharacters;

        //Embaralha e pega apenas a quantidade de caracteres informada no parâmetro
        return substr(str_shuffle($characters), 0, $numberOfCharacter);
    }
}
