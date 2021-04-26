const _ = require("iotdb-helpers")
const editor = require(".")

/**
 */
const edit_loop = _.promise((self, done) => {
    const _doit = () => {
        _.promise(self)
            .each({
                method: editor.cli.prompt,
                inputs: "template.columns:column",
            })
            .make(sd => {
                console.log("---")
                console.log(JSON.stringify(sd.item, null, 2))
                console.log("--")
            })
            .then(editor.cli.ask.p("OK?", [ "Save", "Cancel", "Edit" ]))
            .make(sd => {
                if (sd.answer === "Edit") {
                    process.nextTick(_doit)
                } else {
                    done(null, self)
                }
            })
            .catch(error => {
                done(error)
            })
    }

    _doit()
})

_.promise({
    template: require("./model.json"),
    item: {},
})
    .then(edit_loop)
    .catch(error => {
        console.log("#", _.error.message(error))
    })
