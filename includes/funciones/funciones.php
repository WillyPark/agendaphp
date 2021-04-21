<?php
function obtenerContactos(){
    include "db.php";

    try {
        return $conn->query("SELECT * FROM contactos");
    } catch (Exception $e) {
        echo "Error " . $e->getMessage() . "<br>";
        return false;
    }
}

//Obtiene el contacto y toma un id
function obtenerContacto($id){
    include "db.php";

    try {
        return $conn->query("SELECT * FROM contactos where id = $id");
    } catch (Exception $e) {
        echo "Error " . $e->getMessage() . "<br>";
        return false;
    }
}