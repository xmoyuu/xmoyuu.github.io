function sleep(ms) {
    time = new Date().getTime()
    while (new Date().getTime() < time + ms);
}