process.on('exit', (code, err) => {
    switch(code) {
        case 0: 
            console.log(`PROCESS COMPLETE!`);
            break
        case 1:
            console.log(err.message);
            console.log(`PROCESS FAILED!`);
            break
    }
})