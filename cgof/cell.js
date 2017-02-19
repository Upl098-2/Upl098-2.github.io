const ALIVE = 0,
      DEAD = 1,
      NOTHING = 0,
      KILL = 1,
      BIRTH = 2;


function Cell(state_)
{
    this.state = state_;
    this.next = NOTHING;
}

function Array2D(sizeX, sizeY)
{
    this.sizeX = sizeX ? sizeX : 1;
    this.sizeY = sizeY ? sizeY : 1;
    this.get = new Array(sizeX);
    for(i = 0; i < sizeX; i++)
        {
            this.get[i] = new Array(sizeY);
        }
}