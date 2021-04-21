<?php

// Credenciales de la base de datos

define("DB_USUARIO", "");
define("DB_PASSWORD", "");
define("DB_HOST", "");
define("DB_NOMBRE", "");

$conn = new mysqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NOMBRE);

// echo $conn->ping(); Con esto consultamos si nos conectamos bien, nos debe devolver 1
