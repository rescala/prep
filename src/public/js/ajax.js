$(function () {


    $('select').on('change',function(){
        var valor = $('#seccionesLista').find(":selected").val();
        $('#example6 tbody').html('');
        console.log(valor);
        $.ajax({
            url: "/delegados/listaXseccion/"+valor,
            method: "GET",
            success: function (response) {
                console.log(response);
                for (let index = 0; index < response.length; index++) {
                    
                    if (!response[index].del_nombre) {
                        $('#example6 tbody').append("<tr><td> "+response[index].id_persona+"</td><td>"+response[index].seccion_lista+" </td><td>"+response[index].casilla_lista+" </td><td>"+response[index].nom2+" "+response[index].ape_pat+" "+response[index].ape_mal+"</td><td>"+response[index].direccion+" </td><td><div class='form-check'><input class='form-check-input' type='checkbox' name='asignar'value='"+response[index].id_persona+"' id='flexCheckDefault'><label class='form-check-label' for='flexCheckDefault'>Registrar</label></div></td></tr>");
                    }else{
                        $('#example6 tbody').append("<tr><td style='color:red';> "+response[index].id_persona+"</td><td style='color:red';>"+response[index].seccion_lista+" </td><td style='color:red';>"+response[index].casilla_lista+" </td><td style='color:red';>"+response[index].nom2+" "+response[index].ape_pat+" "+response[index].ape_mal+"</td><td style='color:red';>"+response[index].direccion+" </td><td style='color:red';>"+response[index].del_nombre+" "+response[index].del_apepat+" "+response[index].del_apemat+"</td></tr>");
                    }
                }
            }
        })
        
    });


    /*$('#cargar').on('click', function () {
        let valor = $('#valor').val();
        let parametro = $('select').find(":selected").val();
        if (!valor) {
            valor = "0";
        }
        console.log(parametro + "  " + valor);
        $.ajax({
            url: "/visores/seccionesT/" + parametro + "/" + valor,
            method: "GET",
            success: function (response) {
                
                if (response == "Error") {
                    alert("Establezca un parámetro");
                }
                if (response == "") {
                    alert("No se encontraron datos con ese parámetro de búsqueda");
                }
                for (let index = 0; index < response.length; index++) {
                    if (!response[index].apm) {
                        response[index].apm="";
                        response[index].app1="";
                        response[index].app2="";
                    }
                    $('#exampleFill tbody').append("<tr><td style='color:red';> "+response[index].seccion_lista+"</td><td style='color:red';>"+response[index].casilla+" </td><td style='color:red';>"+response[index].num_lista_nominal+" </td><td style='color:red';>"+response[index].vota_pt+" </td><td style='color:red';>"+response[index].ape_pat+" "+response[index].ape_mat+" "+response[index].nom2+"</td><td style='color:red';>"+response[index].programa+" </td><td style='color:red';>"+response[index].monto+" </td><td style='color:red';>"+response[index].telefono+" </td><td style='color:red';>"+response[index].direccion+" </td><td style='color:red';>"+response[index].voto+"</td><td style='color:red';>"+response[index].apm+" "+response[index].app1+" "+response[index].app2+"</td></tr>");
                    //console.log(response[index].nom2);
                }
            }
        })
    });*/


    $('table').on('click', '.vota', function () {
        let row = $(this).closest('tr');
        let id = row.find('.id').text();
        var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
        myModal.show();
        $('#exampleModal').on('click', '.aceptar', function () {
            myModal.hide();
            $.ajax({
                url: "/casillas/votar/" + id,
                method: "PUT",
                success: function (response) {
                    console.log(response);
                    if (response = 'Actualizado') {
                        $(".inner").addClass("show");
                        row.remove();
                    } else {
                        $(".inner2").addClass("show");
                    }
                }
            })
        });
    });

    $('table').on('click', '.elimina', function () {
        let row = $(this).closest('tr');
        let id = row.find('.id').text();
        var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
        myModal.show();
        $('#exampleModal').on('click', '.aceptar', function () {
            myModal.hide();
            $.ajax({
                url: "/delegados/delete/" + id,
                method: "PUT",
                success: function (response) {
                    console.log(response);
                    if (response = 'Eliminado') {
                        $(".inner").addClass("show");
                        row.remove();
                    } else {
                        $(".inner2").addClass("show");
                    }
                }
            })
        });
    });

    $('table').on('click', '.elimina_promovido', function () {
        let row = $(this).closest('tr');
        let id = row.find('.id').text();
        var myModal = new bootstrap.Modal(document.getElementById('exampleModalB'));
        myModal.show();
        $('#exampleModalB').on('click', '.aceptar', function () {
            myModal.hide();
            $.ajax({
                url: "/delegados/promovidos/delete/" + id,
                method: "PUT",
                success: function (response) {
                    console.log(response);
                    if (response = 'Eliminado') {
                        $(".inner").addClass("show");;
                        row.remove();
                    } else {
                        $(".inner2").addClass("show");
                    }
                }
            })
        });
    });

    $('table').on('click', '.eliminar_lista', function () {
        let row = $(this).closest('tr');
        let id = row.find('.id').text();
        var myModal = new bootstrap.Modal(document.getElementById('exampleModal5'));
        myModal.show();
        $('#exampleModal5').on('click', '.aceptar', function () {
            myModal.hide();
            $.ajax({
                url: "/mpios/seccion/casillas/lista/eliminar/" + id,
                method: "PUT",
                success: function (response) {
                    console.log(response);
                    if (response = 'Eliminado') {
                        $(".inner").addClass("show");;
                        location.reload();
                    } else {
                        $(".inner2").addClass("show");
                    }
                }
            })
        });
    });

    $('table').on('click', '.sumar_lista', function () {
        let row = $(this).closest('tr');
        let id = row.find('.id').text();
        var myModal = new bootstrap.Modal(document.getElementById('exampleModal6'));
        myModal.show();
        $('#exampleModal6').on('click', '.aceptar', function () {
            myModal.hide();
            $.ajax({
                url: "/mpios/seccion/casilla/lista/add/" + id,
                method: "PUT",
                success: function (response) {
                    console.log(response);
                    if (response = 'Creado') {
                        $(".inner3").addClass("show");;
                        location.reload();
                    } else {
                        $(".inner2").addClass("show");
                    }
                }
            })
        });
    });

});