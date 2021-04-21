<?php

if($_POST){
    if($_POST["accion"] == "crear"){
        //Creara un nuevo registro en la BD
    
        require_once("../funciones/db.php");
    
        //Validar las entradas
        $nombre = filter_var($_POST["nombre"], FILTER_SANITIZE_STRING);
        $empresa = filter_var($_POST["empresa"], FILTER_SANITIZE_STRING);
        $telefono = filter_var($_POST["telefono"], FILTER_SANITIZE_STRING);
    
        try {
            $stmt = $conn->prepare("INSERT INTO contactos (nombre, empresa, telefono) VALUES (?,?,?)");
            $stmt->bind_param("sss", $nombre, $empresa, $telefono); //s = string
            $stmt->execute();
    
            if($stmt->affected_rows == 1){ //Es una forma de saber si se hizo una inserción a la BD
                $respuesta = array(
                    "respuesta" => "correcto",
                    "datos" => array (
                        "nombre" => $nombre,
                        "empresa" => $empresa,
                        "telefono" => $telefono,
                        "id_insertado" => $stmt->insert_id //Para conocer el id insertado
                    )
                );
            }
    
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            $respuesta = array (
                "error" => $e->getMessage()
            );
        }
    
        echo json_encode($respuesta);
    } 

    if($_POST["accion"] == "editar"){
        require_once("../funciones/db.php");
    
        //Validar las entradas
        $nombre = filter_var($_POST["nombre"], FILTER_SANITIZE_STRING);
        $empresa = filter_var($_POST["empresa"], FILTER_SANITIZE_STRING);
        $telefono = filter_var($_POST["telefono"], FILTER_SANITIZE_STRING);
        $id = filter_var($_POST["id"], FILTER_SANITIZE_NUMBER_INT);

        try {
            $stmt = $conn->prepare("UPDATE contactos SET nombre = ?, empresa = ?, telefono = ? WHERE id = ?");
            $stmt->bind_param("sssi", $nombre, $empresa, $telefono, $id);
            $stmt->execute();

            if($stmt->affected_rows == 1){
                $respuesta = array (
                    "respuesta" => "correcto"
                );
            } else{
                $respuesta = array (
                    "respuesta" => "error"
                );
            }

            $stmt->close();
            $conn->close();

        } catch (Exception $e) {
            $respuesta = array (
                "error" => $e->getMessage()
            );
        }

        echo json_encode($respuesta);
    }
}

if ($_GET) {
    if($_GET["accion"] == "borrar"){
        //Abrir la conexión
        require_once("../funciones/db.php");
    
        //Validar el Id
        $id = filter_var($_GET["id"], FILTER_SANITIZE_NUMBER_INT);
    
        try {
            $stmt = $conn->prepare("DELETE FROM contactos WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
    
            if($stmt->affected_rows == 1){
                $respuesta = array(
                    "respuesta" => "correcto"
                );
            }
    
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            $respuesta = array (
                "error" => $e->getMessage()
            );
        }
    
        echo json_encode($respuesta);
    }
}




