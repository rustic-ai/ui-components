import { transformTableData } from '../../src/components/visualization/perspectiveViz/perspectiveViz'

describe('transformData function', () => {
  it('should transform the input array of records correctly', () => {
    const inputArray = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]

    const expectedOutput = [
      { name: ['Alice'], age: [inputArray[0].age] },
      { name: ['Bob'], age: [inputArray[1].age] },
    ]

    const result = transformTableData(inputArray)
    expect(result).to.deep.equal(expectedOutput)
  })
})
