function find(list, predicate){
    var value;
    for(var i = 0; i < list.length; i++){
        value = list[i];
        if(predicate(value, i, list))
            return value;
    }
    return undefined;
}

module.exports = {
    byId: function (id, list) {
        return find(list, function (value) {
            return value.id == id;
        });
    },
}