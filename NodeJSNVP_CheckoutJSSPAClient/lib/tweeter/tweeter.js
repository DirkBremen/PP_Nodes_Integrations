

function randomReal(low, high)
// Given  : low <= high
// Given  : a random real number in the range [low, high)
{
    return Math.random()*(high-low) + low;
}

function randomInt(low, high)
// Given  : low <= high
// Given  : a random real integer in the range [low, high]
{
    return Math.floor(Math.random()*(high-low+1)) + low;
}

function randomChar(str)
// Given  : str is a nonempty string
// Returns: a random character from the string
{
        return str.charAt(randomInt(0, str.length-1));
}

function randomItem(list)
// Given  : list is a nonempty list (array)
// Returns: a random item from the list
{
        return list[randomInt(0, list.length-1)];
}

var bind = Function.prototype.bind;

Function.prototype.bind = function() {
    if (arguments[0] === undefined) {
        arguments[0] = null;
    }
    return bind.apply(this, arguments);
}