/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import Api from '../tools/api';
import { __, allPass, compose, both, ifElse, length, test, lt, gt, modulo, tap, andThen, prop, otherwise, call, converge, always, evolve } from 'ramda';

const api = new Api();

const isPositiveNum = test(/^\d+\.?\d*$/);
const isLengthFrom3to9 = compose(both(lt(__, 10), gt(__, 2)), length);
const isValidNumber = compose(
    allPass([isLengthFrom3to9, isPositiveNum]),
    prop('value')
);

const callFunctionWithArg = (fn, arg) => converge(call, [fn, arg]);
const logValue = callFunctionWithArg(prop('writeLog'), prop('value'));
const handleValidationError = callFunctionWithArg(prop('handleError'), always('Validation Error'));
const handleNetworkError = callFunctionWithArg(prop('handleError'), prop('value'));
const handleSuccess = callFunctionWithArg(prop('handleSuccess'), prop('value'));

const roundNumber = compose(Math.round, Number);
const logRoundedNumber = callFunctionWithArg(prop('writeLog'), compose(roundNumber, prop('value')));
const processRoundedNumber = compose(
    evolve({
        value: roundNumber,
    }),
    tap(logRoundedNumber)
);

const squareNum = compose((x) => x ** 2, prop('value'));
const logSquaredNum = callFunctionWithArg(prop('writeLog'), squareNum);

const remainderOfDivisionBy3 = modulo(__, 3);
const logRemainder = callFunctionWithArg(
    prop('writeLog'),
    compose(remainderOfDivisionBy3, prop('value'))
);
const processRemainder = compose(evolve({ value: remainderOfDivisionBy3 }), tap(logRemainder));

const getBinaryNum = (options) =>
    new Promise(async (resolve, reject) => {
        const { writeLog, value, handleError } = options;

        try {
            const { result } = await api.get('https://api.tech/numbers/base', {
                from: 10,
                to: 2,
                number: value,
            });

            writeLog(result);

            writeLog(length(result));

            resolve(options);
        } catch (error) {
            reject({ value: error, handleError });
        }
    });

const getAnimal = (options) =>
    new Promise(async (resolve, reject) => {
        const { value, handleSuccess, handleError } = options;

        try {
            const { result } = await api.get(`https://animals.tech/${value}`, {});

            resolve({ value: result, handleSuccess });
        } catch (error) {
            reject({ value: error, handleError });
        }
    });

const processValidNumber = compose(
    otherwise(handleNetworkError),
    andThen(handleSuccess),
    andThen(getAnimal),
    andThen(processRemainder),
    andThen(tap(logSquaredNum)),
    getBinaryNum,
    processRoundedNumber
);

const processSequence = compose(
    ifElse(isValidNumber, processValidNumber, handleValidationError),
    tap(logValue)
);

export default processSequence;
