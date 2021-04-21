<?php

// Credenciales de la base de datos

define("DB_USUARIO", "epiz_28430323");
define("DB_PASSWORD", "aEkUpP162PISld");
define("DB_HOST", "sql302.epizy.com");
define("DB_NOMBRE", "epiz_28430323_agendaphp");

$conn = new mysqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NOMBRE);

// echo $conn->ping(); Con esto consultamos si nos conectamos bien, nos debe devolver 1