const username = 'superSu';
const password = 'superSu';
const uuid = '5f50552d-86e6-49eb-9da2-d927680af814';

const returningMockedUser = () => ({
    rows: [
        {
            uuid,
            username,
            password
        }
    ]
});

const mockNewUser = {
    uuid: "123",
    username: 'antonio',
    password: 'Antonio2'
}

class Pool {
    query(script: any, values: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            if (values === undefined) {
                resolve(returningMockedUser());
            }

            if (values[0] === uuid || values[2] === uuid) {
                resolve(returningMockedUser());
            }

            if (values[0] === username && values[1] === password) {
                resolve(returningMockedUser());
            }

            if (script.split(" ")[16] == 'INSERT') {
                resolve({ rows: [{ uuid }] });
            }

            if (values[0] !== username && values[0] !== mockNewUser.uuid && values[1] == undefined) {
                resolve(returningMockedUser());
            }

            reject(false);
        })
    }
}

module.exports = Pool;