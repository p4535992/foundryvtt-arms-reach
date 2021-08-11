import { MODULE_NAME } from "./settings.js";
/**
 * About this module FormApp
 * @extends FormApplication
 */
export default class FilePickerFormApp extends FormApplication {
    constructor(options = {}) {
        super(options);
    }
    /**
     * Call app default options
     * @override
     */
    static get defaultOptions() {
        //@ts-ignore
        const oldFilePickerOptions = mergeObject(super.defaultOptions, FilePicker.defaultOptions);
        //Object.defineProperty(FilePicker, "defaultOptions", {
        //  get: () => {
        //@ts-ignore
        return mergeObject(oldFilePickerOptions, {
            template: "modules/" + MODULE_NAME + "/filepicker.html",
            classes: ["filepicker"],
            width: 500,
            tabs: [{ navSelector: ".tabs" }],
            resizable: true
        });
        //  }
        //});
    }
    _updateObject(event, formData) {
        throw new Error('Method not implemented.');
    }
}
