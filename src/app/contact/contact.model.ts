
export class Contact {

    public id?: number;
    public firstName?: string;
    public lastName?: string;
    public email?: string;
    public phone?: string;
    public editing?: boolean;

    constructor(contact: object) {
        Object.assign(this, contact);

    }
    setState(contact: object) {
        if (contact == null || Object.keys(contact).length === 0) {
            return true;
        }
        let editing = false;
        Object.keys(contact).forEach((key) => {
            console.log('from setState...', contact[key]);
            if (contact[key] == null) {
                editing = true;
            }
        });
        return editing;
    }
}
