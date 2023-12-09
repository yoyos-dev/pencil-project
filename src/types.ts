export type Dealer = {
    firstName: string;
    lastName: string;
    startTime: string;
    endTime: string;
    games?: {
        [key: string]: boolean;
    };
};