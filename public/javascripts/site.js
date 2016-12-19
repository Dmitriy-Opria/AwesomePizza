/**
 * Created by demon on 17.12.2016.
 */
function removePizza(taskID) {
    "use strict";
    $.ajax({
        method: "POST",
        url: "/removePizza",
        data: {id: taskID}
    })
        .done(function () {
            $("#"+taskID).css("display", "none");
            alertify.success("Пицца успешно удалена");
        })
        .fail(function () {
            alertify.error("Случилась ошибка удаления!");
        })
    taskID.preventDefault()
}
function changePizza(taskID) {
    "use strict";
    $.ajax({
        method: "POST",
        url: "/change-Pizza",
        data: {id: taskID}
    })
        .done(function (template) {
            $("#"+taskID)
                .html(template.html)
        })
        .fail(function () {
            alertify.error("Случилась ошибка удаления!");
        })
    taskID.preventDefault()
}
function removeComplain(taskID) {
    "use strict";
    $.ajax({
        method: "POST",
        url: "/removeComplain",
        data: {id: taskID}
    })
        .done(function () {
            $("#"+taskID).css("display", "none");
            alertify.success("Сообщение удалено");
        })
        .fail(function () {
            alertify.error("Случилась ошибка удаления!");
        })
    taskID.preventDefault()
}
$("#orderPizza").on('submit', function (form) {
    $.ajax({
        method: "POST",
        url: "/orderPizza",
        data: $(this).serialize(),
        processData: false
    })
        .done(function () {
            alertify.success("Ваш заказ принят!")
        })
        .fail(function () {
            alertify.error("Не удалось оставить заказ.")
        })
        .always(function () {
        });
})

