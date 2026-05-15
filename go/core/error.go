package core

type RealRestError struct {
	IsRealRestError bool
	Sdk              string
	Code             string
	Msg              string
	Ctx              *Context
	Result           any
	Spec             any
}

func NewRealRestError(code string, msg string, ctx *Context) *RealRestError {
	return &RealRestError{
		IsRealRestError: true,
		Sdk:              "RealRest",
		Code:             code,
		Msg:              msg,
		Ctx:              ctx,
	}
}

func (e *RealRestError) Error() string {
	return e.Msg
}
