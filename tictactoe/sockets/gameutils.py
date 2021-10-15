def getMatrixPositionByMove(move):
    '''
    Returns a position(x,y) 0 indexing 
    correspondes to move
    m1 to m9
    '''

    move = int(move[-1])
    if move <= 3:
        return (0,(move-1)%3)
    elif move <= 6:
        return (1,(move-1)%3)
    else:
        return (2,(move-1)%3)



def is_Game_End(matrix):
    status,winner = row_matches(matrix)
    if status:
        return winner

    status,winner = column_matches(matrix)
    if status:
        return winner

    status,winner = diagonal_matches(matrix)
    if status:
        return winner

    cnt = 0

    for i in range(0,3):
        for j in range(0,3):
            if matrix[i][j]!='':
                cnt+=1

    if cnt == 9:
        return 'tie'

    return None


def row_matches(matrix):
    for i in range(3):
        if matrix[i][0] == matrix[i][1] and matrix[i][1] == matrix[i][2] and matrix[i][0]!='':
            return (True,matrix[i][0])

    return (False,None)


def column_matches(matrix):
    for i in range(3):
        if matrix[0][i] == matrix[1][i] and matrix[1][i] == matrix[2][i] and matrix[0][i]!='':
            return (True,matrix[0][i])
    return (False,None)



def diagonal_matches(matrix):
    if matrix[0][0] == matrix[1][1] and matrix[1][1] == matrix[2][2] and matrix[0][0]!='':
        return (True,matrix[0][0])
    elif matrix[0][2] == matrix[1][1] and matrix[1][1] == matrix[2][0] and matrix[2][0]!='':
        return (True,matrix[0][2])
    else:
        return (False,None)