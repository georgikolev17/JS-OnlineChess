import {get, post, put, del} from './requester.js';
import * as authHandler from './handlers/auth-handler.js';
import { setHeaderInfo, getPartials } from './shared.js';

const app = Sammy('#rooter', function() {
    this.use('Handlebars', 'hbs');
    this.get('/', function(ctx){
    setHeaderInfo(ctx);

    if(ctx.isAuth) {
        get('appdata', 'games', 'Kinvey')
            .then(games => {
                ctx.games = games;
                this.loadPartials(getPartials())
                    .partial('./views/home.hbs');
            })
    } else {
        this.loadPartials(getPartials())
        .partial('./views/home.hbs');
    }
    });
    
    this.get('/register', authHandler.getRegister);

    this.post('/register', authHandler.postRegister);

    this.get('/login', authHandler.getLogin);

    this.post('/login', authHandler.postLogin);

    this.get('/logout', authHandler.getLogout);

    this.get('/new-game', function(ctx) {
        setHeaderInfo(ctx);
        this.loadPartials(getPartials())
            .partial('./views/game/new-game.hbs');
    });

    this.post('/new-game', function(ctx) {
        const { name, minutes, increment } = ctx.params;

        if(name && minutes > 0 && increment >= 0) {
            let chessboard = [
                [ "R", "N", "B", "K", "Q", "B", "N", "R" ],
                [ "P", "P", "P", "P", "P", "P", "P", "P" ],
                [ " ", " ", " ", " ", " ", " ", " ", " " ],
                [ " ", " ", " ", " ", " ", " ", " ", " " ],
                [ " ", " ", " ", " ", " ", " ", " ", " " ],
                [ " ", " ", " ", " ", " ", " ", " ", " " ],
                [ "p", "p", "p", "p", "p", "p", "p", "p" ],
                [ "r", "n", "b", "k", "q", "b", "n", "r" ]
            ];
            let code = '_' + Math.random().toString(36).substr(2, 9);
            let gameState = 'Waiting', isStarted = false, isWhiteTurn = true, whitePlayerId = sessionStorage.getItem('authtoken')
                , blackPlayerId = null, time = minutes, moves=[], numberOfMoves = 0;
            post('appdata', 'games', 'Kinvey', {
                name,
                code,
                gameState,
                isStarted,
                isWhiteTurn,
                chessboard,
                time,
                increment,
                whitePlayerId,
                blackPlayerId,
                moves,
                numberOfMoves
            }).then(() => {
                console.log(code);
                sessionStorage.setItem('gameState', gameState);
                ctx.redirect('/');
            }).catch(console.error)
        }
    })
});

app.run();