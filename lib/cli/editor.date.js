/**
 *  lib/cli/editor.date.js
 *
 *  David Janes
 *  Concordance
 *  2020-09-24
 */

"use strict"

const _ = require("iotdb-helpers")
const inquirer = require("inquirer")

/**
 */
const date = _.promise((self, done) => {
    inquirer
        .prompt([
            {
                type: "datetime",
                name: "value",
                message: self.prompt,
                suffix: ":",
                prefix: "-",
                format: [ "yyyy", "-", "dd", "-", "mm" ],
                initial: self.in ? new Date(self.in) : new Date("0001-01-01"),
            },
        ])
        .then(result => {
            if (result.value.getFullYear() === 1) {
                self.out = null
            } else {
                self.out = result.value.toISOString().substring(0, 10) + "Z"
            }

            done(null, self)
        })
        .catch(x => {
            x.self = self
            done(x)
        })
})

date.method = "lib.cli.editor.date"
date.description = ``
date.requires = {
    prompt: _.is.String,
    in: [ _.is.String, _.is.Null ],
    out: _.is.Null,
    required: _.is.Boolean,
}
date.accepts = {
}
date.produces = {
    out: _.is.String,
}

/**
 *  API
 */
exports.date = date
