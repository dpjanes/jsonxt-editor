/**
 *  lib/cli/ask.js
 *
 *  David Janes
 *  Concordance
 *  2020-09-25
 */

"use strict"

const _ = require("iotdb-helpers")
const inquirer = require("inquirer")

/**
 */
const ask = _.promise((self, done) => {
    const choices = [
        new inquirer.Separator(),
    ].concat(self.choices || [ "Yes", "No", ])
    
    inquirer
        .prompt([
            {
                type: "list",
                name: "value",
                message: self.prompt || "OK",
                choices: choices,
                suffix: "",
                prefix: "-",
            },
        ])
        .then(result => {
            self.answer = _.coerce.string.nulled(result.value.trim())

            done(null, self)
        })
        .catch(x => {
            x.self = self
            done(x)
        })
})

ask.method = "lib.cli.editor.ask"
ask.description = ``
ask.requires = {
    in: [ _.is.String, _.is.Null ],
    out: _.is.Null,
    required: _.is.Boolean,
}
ask.accepts = {
    prompt: _.is.String,
    choices: _.is.Array.of.String,
}
ask.produces = {
    answer: _.is.String,
}
ask.params = {
    prompt: _.p.normal,
    choices: _.p.normal,
}
ask.p = _.p(ask)

/**
 *  API
 */
exports.ask = ask
