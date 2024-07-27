/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { __, compose, count, propEq, equals, allPass, gte, values, all, converge, complement, filter, countBy, identity, any, prop } from 'ramda';

const squareColor = prop('square');
const triangleColor = prop('triangle');

const isStar = propEq('star');
const isSquare = propEq('square');
const isCircle = propEq('circle');
const isTriangle = propEq('triangle');

const isRed = equals('red');
const isGreen = equals('green');
const isBlue = equals('blue');
const isOrange = equals('orange');
const isWhite = equals('white');

const countRed = compose(count(isRed), values);
const countGreen = compose(count(isGreen), values);
const countBlue = compose(count(isBlue), values);

const countOccurrences = compose(values, countBy(identity));

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    isStar('red'),
    isSquare('green'),
    isCircle('white'),
    isTriangle('white'),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(gte(__, 2), count(isGreen), values);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [countRed, countBlue]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([isCircle('blue'), isStar('red'), isSquare('orange')]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
    any(gte(__, 3)),
    countOccurrences,
    filter(complement(isWhite)),
    values
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    compose(equals(2), countGreen),
    isTriangle('green'),
    compose(equals(1), countRed),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(all(isOrange), values);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([complement(isStar('red')), complement(isStar('white'))]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(all(isGreen), values);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    complement(isTriangle('white')),
    converge(equals, [triangleColor, squareColor]),
]);
