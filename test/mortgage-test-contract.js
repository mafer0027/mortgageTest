/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { MortgageTestContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('MortgageTestContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new MortgageTestContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"mortgage test 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"mortgage test 1002 value"}'));
    });

    describe('#mortgageTestExists', () => {

        it('should return true for a mortgage test', async () => {
            await contract.mortgageTestExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a mortgage test that does not exist', async () => {
            await contract.mortgageTestExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createMortgageTest', () => {

        it('should create a mortgage test', async () => {
            await contract.createMortgageTest(ctx, '1003', 'mortgage test 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"mortgage test 1003 value"}'));
        });

        it('should throw an error for a mortgage test that already exists', async () => {
            await contract.createMortgageTest(ctx, '1001', 'myvalue').should.be.rejectedWith(/The mortgage test 1001 already exists/);
        });

    });

    describe('#readMortgageTest', () => {

        it('should return a mortgage test', async () => {
            await contract.readMortgageTest(ctx, '1001').should.eventually.deep.equal({ value: 'mortgage test 1001 value' });
        });

        it('should throw an error for a mortgage test that does not exist', async () => {
            await contract.readMortgageTest(ctx, '1003').should.be.rejectedWith(/The mortgage test 1003 does not exist/);
        });

    });

    describe('#updateMortgageTest', () => {

        it('should update a mortgage test', async () => {
            await contract.updateMortgageTest(ctx, '1001', 'mortgage test 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"mortgage test 1001 new value"}'));
        });

        it('should throw an error for a mortgage test that does not exist', async () => {
            await contract.updateMortgageTest(ctx, '1003', 'mortgage test 1003 new value').should.be.rejectedWith(/The mortgage test 1003 does not exist/);
        });

    });

    describe('#deleteMortgageTest', () => {

        it('should delete a mortgage test', async () => {
            await contract.deleteMortgageTest(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a mortgage test that does not exist', async () => {
            await contract.deleteMortgageTest(ctx, '1003').should.be.rejectedWith(/The mortgage test 1003 does not exist/);
        });

    });

});
