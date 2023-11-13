import logo from "./logo.svg";
import "./App.css";
import { Select } from "antd";
import { Input } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import Bar from "./components/Bar";
function App() {
  const [numbers, setNumbers] = useState();
  const [realnumber, setRealNumber] = useState([]);
  const [sort, SetSort] = useState();

  const handleChange = (value) => {
    SetSort(value);
    console.log(`selected ${value}`);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSort = async () => {
    const sortedNumber = [...realnumber];

    if (sort === "selection") {
      for (let i = 0; i < sortedNumber.length - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < sortedNumber.length; j++) {
          if (sortedNumber[j].value < sortedNumber[minIndex].value) {
            minIndex = j;
          }
        }

        sortedNumber[i].selected = true;
        sortedNumber[minIndex].selected = true;

        [sortedNumber[i], sortedNumber[minIndex]] = [
          sortedNumber[minIndex],
          sortedNumber[i],
        ];

        await delay(2000);
        setRealNumber([...sortedNumber]);

        sortedNumber[i].selected = false;
        sortedNumber[minIndex].selected = false;
      }

      setRealNumber([...sortedNumber]);
    } else if (sort === "bubble") {
      for (let i = 0; i < sortedNumber.length - 1; i++) {
        for (let j = 0; j < sortedNumber.length - i - 1; j++) {
          if (sortedNumber[j].value > sortedNumber[j + 1].value) {
            sortedNumber[j].selected = true;
            sortedNumber[j + 1].selected = true;

            [sortedNumber[j], sortedNumber[j + 1]] = [
              sortedNumber[j + 1],
              sortedNumber[j],
            ];

            await delay(2000);
            setRealNumber([...sortedNumber]);

            sortedNumber[j].selected = false;
            sortedNumber[j + 1].selected = false;
          }
        }
      }
    } else if (sort === "insertion") {
      for (let i = 1; i < sortedNumber.length; i++) {
        let current = sortedNumber[i];
        let j = i - 1;

        while (j >= 0 && sortedNumber[j].value > current.value) {
          sortedNumber[j].selected = true;
          sortedNumber[j + 1] = sortedNumber[j];
          j--;
          await delay(2000);
          setRealNumber([...sortedNumber]);
        }

        sortedNumber[j + 1] = current;
        sortedNumber[j + 1].selected = false;
        setRealNumber([...sortedNumber]);
      }
    } else if (sort === "radix") {
      const getMax = (arr) => {
        let max = arr[0].value;
        for (let i = 1; i < arr.length; i++) {
          if (arr[i].value > max) {
            max = arr[i].value;
          }
        }
        return max;
      };

      const countSort = (arr, exp) => {
        const n = arr.length;
        const output = new Array(n).fill(0);
        const count = new Array(10).fill(0);

        for (let i = 0; i < n; i++) {
          count[Math.floor(arr[i].value / exp) % 10]++;
        }

        for (let i = 1; i < 10; i++) {
          count[i] += count[i - 1];
        }

        for (let i = n - 1; i >= 0; i--) {
          output[count[Math.floor(arr[i].value / exp) % 10] - 1] = arr[i];
          count[Math.floor(arr[i].value / exp) % 10]--;
        }

        for (let i = 0; i < n; i++) {
          arr[i] = output[i];
        }
      };
      const max = getMax(sortedNumber);

      for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        countSort(sortedNumber, exp);
        await delay(2000);
        setRealNumber([...sortedNumber]);
      }
    } else if (sort === "heap") {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      const heapify = async (arr, n, i) => {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n && arr[left].value > arr[largest].value) {
          largest = left;
        }

        if (right < n && arr[right].value > arr[largest].value) {
          largest = right;
        }

        if (largest !== i) {
          [arr[i], arr[largest]] = [arr[largest], arr[i]];
          await delay(2000);
          setRealNumber([...arr]);

          await heapify(arr, n, largest);
        }
      };

      const heapSort = async () => {
        const sortedNumber = [...realnumber];
        const n = sortedNumber.length;

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
          await heapify(sortedNumber, n, i);
        }

        for (let i = n - 1; i > 0; i--) {
          sortedNumber[0].selected = true;
          sortedNumber[i].selected = true;
          [sortedNumber[0], sortedNumber[i]] = [
            sortedNumber[i],
            sortedNumber[0],
          ];
          await delay(2000);
          setRealNumber([...sortedNumber]);

          await heapify(sortedNumber, i, 0);
          sortedNumber[0].selected = false;
          sortedNumber[i].selected = false;
        }
      };

      await heapSort();
    }
  };

  const handleShow = () => {
    // console.log(numbers);
    const num = numbers.trim();
    const number1 = num.split(" ");
    // console.log("split", number1);
    setRealNumber(
      number1.map((number) => ({
        id: Number(number),
        value: Number(number),
        selected: false,
      }))
    );
  };

  useEffect(() => {
    console.log("Updated realnumber:", realnumber);
  }, [realnumber, setRealNumber]);

  return (
    <div className="App mt-10 ml-10">
      <header className="App-header">
        <div className="flex items-center">
          <div>
            <img src={logo} width={100} className="App-logo" alt="logo" />
          </div>
          <div className="text-3xl">Sorting Visualizer</div>
          <div className="ml-10 mt-3 border border-b-pink-500 rounded-xl">
            <Select
              defaultValue="Selection Sort"
              style={{
                width: 200,
              }}
              onChange={handleChange}
              options={[
                {
                  value: "selection",
                  label: "Selection Sort",
                },
                {
                  value: "bubble",
                  label: "Bubble Sort",
                },
                {
                  value: "insertion",
                  label: "Insertion Sort",
                },
                {
                  value: "radix",
                  label: "Radix Sort",
                },
                {
                  value: "heap",
                  label: "Heap Sort",
                },
              ]}
            />
          </div>
        </div>
        <div className="text-left ml-10 mt-10">
          Enter values :
          <div className="w-72 mt-5">
            <Input
              label="Enter the values with space"
              onChange={(e) => {
                setNumbers(e.target.value);
              }}
            />
          </div>
          <div className="mt-5">
            <Button onClick={handleShow}>Submit</Button>
          </div>
        </div>
      </header>
      <div className="flex justify-center mt-10">
        {realnumber.length > 0 && (
          <div className="flex">
            {realnumber.map((number) => {
              return (
                <Bar
                  key={number.id}
                  index={number.id}
                  value={number.value}
                  isSelected={number.selected}
                />
              );
            })}
          </div>
        )}
      </div>
      {realnumber.length > 0 && (
        <Button className="mt-5" onClick={handleSort}>
          Sort
        </Button>
      )}
    </div>
  );
}

export default App;
