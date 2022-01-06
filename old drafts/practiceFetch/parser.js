getData();

async function getData() {
    const response = await fetch("test.csv");
    const data = await response.text();
    //console.log(data);

    const rows = data.split("\n").slice(1);
    for (let i = 0; i < rows.length; i++) {
        let currentRow = rows[i].split(",");
        console.log(`YEAR: ${currentRow[0]}, GLOB: ${currentRow[1]}`);
    }

} 
