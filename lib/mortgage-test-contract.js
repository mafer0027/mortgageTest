/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class MortgageTestContract extends Contract {

    async mortgageTestExists(ctx, mortgageTestId) {
        const buffer = await ctx.stub.getState(mortgageTestId);
        return (!!buffer && buffer.length > 0);
    }

    async createMortgageTest(ctx, mortgageTestId, value) {
        const exists = await this.mortgageTestExists(ctx, mortgageTestId);
        if (exists) {
            throw new Error(`The mortgage test ${mortgageTestId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(mortgageTestId, buffer);
    }

    async readMortgageTest(ctx, mortgageTestId) {
        const exists = await this.mortgageTestExists(ctx, mortgageTestId);
        if (!exists) {
            throw new Error(`The mortgage test ${mortgageTestId} does not exist`);
        }
        const buffer = await ctx.stub.getState(mortgageTestId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateMortgageTest(ctx, mortgageTestId, newValue) {
        const exists = await this.mortgageTestExists(ctx, mortgageTestId);
        if (!exists) {
            throw new Error(`The mortgage test ${mortgageTestId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(mortgageTestId, buffer);
    }

    async deleteMortgageTest(ctx, mortgageTestId) {
        const exists = await this.mortgageTestExists(ctx, mortgageTestId);
        if (!exists) {
            throw new Error(`The mortgage test ${mortgageTestId} does not exist`);
        }
        await ctx.stub.deleteState(mortgageTestId);
    }

}

module.exports = MortgageTestContract;
