import { transformTableData } from '../../src/components/visualization/perspectiveViz/perspectiveViz'

describe('transformData function', () => {
  it('should transform the input array of records correctly', () => {
    const inputArray = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]
    const headers = [
      { dataKey: 'name', label: 'Name' },
      { dataKey: 'age', label: 'Age' },
    ]
    const expectedOutput = [
      { Name: 'Alice', Age: inputArray[0].age },
      { Name: 'Bob', Age: inputArray[1].age },
    ]

    const result = transformTableData(inputArray, headers)
    expect(result).to.deep.equal(expectedOutput)
  })
})
