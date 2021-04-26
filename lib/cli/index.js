/**
 *  lib/cli/index.js
 *
 *  David Janes
 *  Concordance
 *  2020-09-24
 */

"use strict"

const _ = require("iotdb-helpers")

module.exports = Object.assign(
    {},
    require("./loop"),
    require("./prompt"),
    require("./ask"),
    {
        "editor": Object.assign(
            {},
            require("./editor.text"),
            require("./editor.date"),
            require("./editor.datetime"),
            require("./editor.link"),
        ),
    },
    {},
)

