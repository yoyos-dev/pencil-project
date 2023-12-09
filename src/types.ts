export type Dealer = {
    firstName: string;
    lastName: string;
    badgeNum: string;
    startTime: string;
    endTime: string;
    games?: {
        [key: string]: boolean;
    };
};